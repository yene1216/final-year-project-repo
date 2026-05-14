import pandas as pd
import os
from tensorflow.keras.utils import load_img, img_to_array
import numpy as np
from tensorflow.keras import models, layers
from sklearn.preprocessing import LabelEncoder
import pickle

loaded_image=[]
train_images=None
test_images=None
val_images=None
train_label_int=None
test_label_int=None
val_label_int=None

class DataPreparation:
    def  load_data(self):
        df = pd.read_csv('/content/sample_data/HAM10000_metadata.csv')
        image_dir = '/content/skin-cancer-mnist-ham10000'
        self.images = []
        self.labels = []
        seen_ids = set()   

        for direc in os.listdir(image_dir):
            dir_path = os.path.join(image_dir, direc)

            if os.path.isdir(dir_path):
                for img_name in os.listdir(dir_path):
                    if img_name.endswith('.jpg'):
                        image_id = img_name.replace('.jpg', '')


                        if image_id in seen_ids:
                            continue

                        row = df[df['image_id'] == image_id]
                        if not row.empty:
                            full_path = os.path.join(dir_path, img_name)

                            self.images.append(full_path)
                            self.labels.append(row['dx'].values[0])
                            seen_ids.add(image_id)  

    def prepare_data(self):

        for image_path in self.images:
          img=load_img(image_path,target_size=(128,128))
          image_array=img_to_array(img)/255.0
          loaded_image.append(image_array)

        # images = np.array(loaded_image, dtype='float32')

        train_images=loaded_image[:8013]
        test_images=loaded_image[8013:9014]
        val_images=loaded_image[9014:]

        # answer_to_index={a:i for i,a in enumerate(self.labels)}
        # index_to_answer={i:a for i,a in answer_to_index.items()}

        train_labels=self.labels[:8013]
        test_labels=self.labels[8013:9014]
        val_labels=self.labels[9014:]

        
        le = LabelEncoder()
        train_label_int = le.fit_transform(train_labels)
        with open("CNN_label_encoder.pkl", "wb") as f:
            pickle.dump(le, f)

        val_label_int = le.transform(val_labels)
        test_label_int = le.transform(test_labels)
    
        train_images = np.array(train_images)
        val_images   = np.array(val_images)

        train_label_int = np.array(train_label_int)
        val_label_int   = np.array(val_label_int)



class CNNTrainer:
    def create_model(self):
        self.model = models.Sequential([
            layers.Conv2D(32, (3, 3), activation='relu', input_shape=(128, 128, 3)),
            layers.MaxPooling2D((2, 2)),
            layers.Conv2D(64, (3, 3), activation='relu'),
            layers.MaxPooling2D((2, 2)),
            layers.Conv2D(128, (3, 3), activation='relu'),
            layers.MaxPooling2D((2, 2)),
            layers.Conv2D(128, (3, 3), activation='relu'),
            layers.MaxPooling2D((2, 2)),
            layers.Flatten(),
            layers.Dropout(0.5),
            layers.Dense(512, activation='relu'),
            layers.Dropout(0.5),
            layers.Dense(7, activation='softmax')
        ])

        self.model.summary()

    def compile_model(self):
        self.model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
        )

    def train(self):
        self.model.fit(train_images, train_label_int,
        validation_data=(val_images, val_label_int),epochs=10)
    def test_model(self):
        test_loss, test_accuracy = self.model.evaluate(test_images, test_label_int, verbose=1)
        print(f"Test Loss: {test_loss:.4f}")
        print(f"Test Accuracy: {test_accuracy:.4f}")
    def save_model(self):
        self.model.save("skin_cancer_model.h5")
        


    


