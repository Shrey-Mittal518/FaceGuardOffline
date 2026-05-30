import cv2
import numpy as np
import os
import pickle

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
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

# Register
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
            # Multiple augmentations
            train_images.append(roi)
            train_labels.append(label)
            # Flip
            train_images.append(cv2.flip(roi, 1))
            train_labels.append(label)
            # Brightness up
            bright = cv2.convertScaleAbs(roi, alpha=1.3, beta=30)
            train_images.append(bright)
            train_labels.append(label)
            # Brightness down
            dark = cv2.convertScaleAbs(roi, alpha=0.7, beta=-30)
            train_images.append(dark)
            train_labels.append(label)
            print(f"Registered: {filename}")
        else:
            print(f"Face not found: {filename}")

if not train_images:
    print("ERROR: No faces found!")
    exit()

recognizer.train(train_images, np.array(train_labels))
os.makedirs("database", exist_ok=True)
recognizer.save("database/face_model.yml")

print(f"\nRegistered: {names}")
print("Camera is starting...")

# Camera
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Equalize histogram — lighting fix
    gray_eq = cv2.equalizeHist(gray)
    
    faces = face_cascade.detectMultiScale(
        gray_eq, 1.1, 5, minSize=(80, 80)
    )

    for (x, y, w, h) in faces:
        roi = gray_eq[y:y+h, x:x+w]
        roi = cv2.resize(roi, (200, 200))
        
        label, confidence = recognizer.predict(roi)
        
        if confidence < 80:
            name = names[label]
            color = (0, 255, 0)
            text = f"{name} ✓ ({int(confidence)})"
        else:
            name = "Unknown"
            color = (0, 0, 255)
            text = "Unknown"

        cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
        cv2.putText(frame, text, (x, y-10),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)

    cv2.imshow("FaceGuard - Face Recognition", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()