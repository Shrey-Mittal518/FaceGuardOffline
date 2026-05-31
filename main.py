import cv2
import numpy as np
import os

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)
eye_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_eye.xml'
)
recognizer = cv2.face.LBPHFaceRecognizer_create()

def get_face_roi(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4, minSize=(50,50))
    if len(faces) > 0:
        x, y, w, h = faces[0]
        roi = gray[y:y+h, x:x+w]
        roi = cv2.resize(roi, (200, 200))
        return roi
    return None

# Register faces
print("Registering faces...")
train_images = []
train_labels = []
names = []

for filename in sorted(os.listdir("known_faces")):
    if filename.endswith(".jpg") or filename.endswith(".png"):
        name = filename.split(".")[0].split("_")[0]
        if name not in names:
            names.append(name)
        label = names.index(name)
        img = cv2.imread(f"known_faces/{filename}")
        if img is None:
            continue
        roi = get_face_roi(img)
        if roi is not None:
            train_images.append(roi)
            train_labels.append(label)
            train_images.append(cv2.flip(roi, 1))
            train_labels.append(label)
            bright = cv2.convertScaleAbs(roi, alpha=1.3, beta=30)
            train_images.append(bright)
            train_labels.append(label)
            dark = cv2.convertScaleAbs(roi, alpha=0.7, beta=-30)
            train_images.append(dark)
            train_labels.append(label)

if not train_images:
    print("ERROR: Koi face nahi mila!")
    exit()

recognizer.train(train_images, np.array(train_labels))
os.makedirs("database", exist_ok=True)
recognizer.save("database/face_model.yml")
print(f"Registered: {names}")

# Blink detection variables
eye_status = []
blink_count = 0
liveness_confirmed = False
prev_eyes = 0

print("Camera chal raha hai! 2 baar blink karo")

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray_eq = cv2.equalizeHist(gray)
    h, w = frame.shape[:2]

    # Face Recognition
    faces = face_cascade.detectMultiScale(
        gray_eq, 1.1, 5, minSize=(80,80)
    )

    name = "Unknown"
    color = (0, 0, 255)

    for (x, y, fw, fh) in faces:
        roi_gray = gray_eq[y:y+fh, x:x+fw]
        roi_resized = cv2.resize(roi_gray, (200, 200))
        
        label, confidence = recognizer.predict(roi_resized)
        if confidence < 65:
            name = names[label]
            color = (0, 255, 0)
        else:
            name = "Unknown"
            color = (0, 0, 255)

        cv2.rectangle(frame, (x, y), (x+fw, y+fh), color, 2)
        cv2.putText(frame, name, (x, y-10),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)

        # Blink Detection using Eye Cascade
        roi_for_eyes = gray_eq[y:y+fh, x:x+fw]
        eyes = eye_cascade.detectMultiScale(
            roi_for_eyes, 1.1, 10, minSize=(20,20)
        )
        current_eyes = len(eyes)

        # Draw eyes
        for (ex, ey, ew, eh) in eyes:
            cv2.rectangle(frame,
                         (x+ex, y+ey),
                         (x+ex+ew, y+ey+eh),
                         (255, 255, 0), 1)

        # Blink detect — eyes visible phir not visible = blink
        if not liveness_confirmed:
            if prev_eyes >= 2 and current_eyes == 0:
                blink_count += 1
                print(f"Blink detected! Total: {blink_count}")
            if blink_count >= 2:
                liveness_confirmed = True

        prev_eyes = current_eyes

    # Status display
    if liveness_confirmed:
        cv2.putText(frame, "LIVE PERSON ✓", (10, 40),
                   cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        if name != "Unknown":
            cv2.putText(frame, f"ACCESS GRANTED - {name}",
                       (10, 80),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.9,
                       (0, 255, 0), 2)
        else:
            cv2.putText(frame, "ACCESS DENIED",
                       (10, 80),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.9,
                       (0, 0, 255), 2)
    else:
        cv2.putText(frame,
                   f"Blink karo! ({blink_count}/2)",
                   (10, 40),
                   cv2.FONT_HERSHEY_SIMPLEX, 1,
                   (0, 165, 255), 2)

    cv2.imshow("FaceGuard - Liveness + Recognition", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()