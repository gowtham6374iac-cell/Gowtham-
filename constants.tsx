
import { PythonFile } from './types';

export const PYTHON_PROJECT: PythonFile[] = [
  {
    name: 'requirements.txt',
    language: 'text',
    content: `pandas==2.1.1
numpy==1.26.0
scikit-learn==1.3.1
tldextract==3.6.0
`
  },
  {
    name: 'train_model.py',
    language: 'python',
    content: `import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# 1. Feature Extraction Logic
def extract_features(url):
    features = []
    # URL Length
    features.append(len(url))
    # Presence of '@'
    features.append(1 if '@' in url else 0)
    # HTTPS Check
    features.append(1 if url.startswith('https') else 0)
    # Dot Count
    features.append(url.count('.'))
    # IP Address Check
    import re
    ip_regex = r'(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])'
    features.append(1 if re.search(ip_regex, url) else 0)
    
    return features

# 2. Dataset Simulation
# In a real project, you would load a CSV like 'phishing_dataset.csv'
data = {
    'url': ['google.com', 'login-paypal.com', '192.168.1.1/login', 'secure-bank-update.tk'],
    'label': [0, 1, 1, 1] # 0 = Safe, 1 = Phishing
}
df = pd.DataFrame(data)

# Extract features for training
X = np.array([extract_features(u) for u in df['url']])
y = df['label']

# 3. Split Data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Train Model
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# 5. Evaluate
y_pred = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred) * 100}%")
print(classification_report(y_test, y_pred))

# 6. Save Model
with open('model/phishing_model.pkl', 'wb') as f:
    pickle.dump(model, f)
`
  },
  {
    name: 'main.py',
    language: 'python',
    content: `import pickle
import numpy as np

def extract_features(url):
    return [
        len(url),
        1 if '@' in url else 0,
        1 if url.startswith('https') else 0,
        url.count('.'),
        1 if any(char.isdigit() for char in url.split('/')[2]) else 0 # Simple IP/Digit check
    ]

def main():
    print("--- Phishing Website Detection System ---")
    
    # Load the pre-trained model
    try:
        with open('model/phishing_model.pkl', 'rb') as f:
            model = pickle.load(f)
    except FileNotFoundError:
        print("Error: Model file not found. Please run train_model.py first.")
        return

    user_url = input("Enter a URL to analyze: ")
    features = np.array([extract_features(user_url)])
    prediction = model.predict(features)

    if prediction[0] == 1:
        print(f"RESULT: [Phishing Website] detected for {user_url}")
    else:
        print(f"RESULT: [Safe Website] detected for {user_url}")

if __name__ == "__main__":
    main()
`
  },
  {
    name: 'README.md',
    language: 'markdown',
    content: `# Phishing Website Detection System

This project uses Machine Learning (Random Forest) to classify URLs as either safe or malicious based on lexical features.

## Installation
1. Install requirements: \`pip install -r requirements.txt\`
2. Train the model: \`python train_model.py\`
3. Run the system: \`python main.py\`

## Extracted Features
- URL Length
- Presence of '@'
- HTTPS Usage
- Dot count
- IP address detection
`
  }
];
