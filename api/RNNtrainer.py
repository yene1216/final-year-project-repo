import pandas as pd
import numpy as np 
import tensorflow as tf
from sklearn.preprocessing import LabelEncoder
import pickle 

class RNNTrainer:
    def prepare_data(self):
        df=pd.read_csv('Disease and symptoms dataset (1).csv')

        diseases=df["diseases"].values
        self.unique_disease=list(set(diseases))
       
        y_diseases=np.array(diseases)
        le=LabelEncoder()
        disease_sequences=le.fit_transform(y_diseases)
        with open("RNN_label_encoder.pkl", "wb") as f:
            pickle.dump(le, f)

        self.symptoms=df.columns.tolist()[1:]
        x=df[self.symptoms]
        x_np_arrays=x.values 
        return disease_sequences,x_np_arrays
    
    def model_preparation(self):
        self.model = tf.keras.Sequential([
            tf.keras.layers.Dense(128, activation='relu', input_shape=(len(self.symptoms),)),
            tf.keras.layers.Dense(64, activation='relu'),
            tf.keras.layers.Dense(len(self.unique_disease), activation='softmax')
        ])


    def compile_model(self):
        self.model.compile(loss='sparse_categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

    def train(self):
        self.diseases_sequence,self.symptoms_array=self.prepare_data()
        self.model_preparation()
        self.compile_model()
        self.model.fit(self.symptoms_array,self.diseases_sequence, epochs=50,batch_size=100, verbose=2)

    def save_model(self):
        self.model.save('Trained_RNN_model.h5')


