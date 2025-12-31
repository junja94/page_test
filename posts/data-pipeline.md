# Data pipelines for industrial AI
Authors: Mina Choi
Date: 2024-06-14
Image: https://images.unsplash.com/photo-1473959383412-c6c58b9b0e4d?auto=format&fit=crop&w=1200&q=80

Edge logs now stream into a feature store so we can retrain anomaly detectors with fresh signals. The pipeline is lightweight enough to run alongside motion control without impacting determinism.

- Kafka-on-K3s for buffering inside the plant.
- Arrow-based feature extraction for interoperability.
- Daily retraining jobs with drift monitoring alerts.
