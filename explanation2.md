# YOLO App Deployment Explanation

This document explains the stages involved in deploying the YOLO app from local development to an Azure Kubernetes Service (AKS) cluster, including persistent storage for MongoDB.

---

## Stage 1: Local Deployment

**Objective:** Test the app in a local Kubernetes environment using Minikube.

### Steps:
1. **Build Docker images**
   
   docker build -t machoyamwangi/yolo-backend:v1.0.2 .
   docker build -t machoyamwangi/yolo-frontend:v1.0.0 .

**Start Minikube cluster**

2. minikube start


Deploy backend, frontend, MongoDB

kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f mongo-deployment.yaml

3. **Access frontend locally**

minikube service yolo-frontend

### Stage 2: External Deployment on AKS

Objective: Deploy the app to AKS for public access.

Steps:

1. Create resource group and AKS cluster

az aks create \
  --resource-group yoloResourceGroup \
  --name yoloCluster \
  --node-count 2 \
  --generate-ssh-keys


2. Configure kubectl for AKS

az aks get-credentials --resource-group yoloResourceGroup --name yoloCluster


3. Push Docker images to Docker Hub

docker push machoyamwangi/yolo-backend:v1.0.2
docker push machoyamwangi/yolo-frontend:v1.0.0


4. Deploy backend, frontend, MongoDB to AKS

kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f mongo-deployment.yaml


5. Access frontend via LoadBalancer

Use the EXTERNAL-IP of the frontend service.

### Stage 3: Persistent Volume Creation and Claim

Objective: Ensure MongoDB data persists across pod restarts.

Steps:

1. Create a PersistentVolumeClaim (PVC)

apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mongo-pvc
  namespace: yolo
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: managed-premium


2. Update MongoDB deployment to mount the PVC

volumeMounts:
  - mountPath: /data/db
    name: mongo-storage
volumes:
  - name: mongo-storage
    persistentVolumeClaim:
      claimName: mongo-pvc


3. Apply PVC + Deployment

kubectl apply -f mongo-pvc-and-deployment.yaml


4. Verify persistence

kubectl get pvc -n yolo

### Notes

-Backend and frontend pods are stateless, MongoDB is stateful with PVC.
-Frontend uses LoadBalancer for external access.
-Docker Hub images must be accessible by AKS; if private, use imagePullSecrets.

### Screenshots
[]!(screenshots/k8s-resources.png)
[]!(screenshots/local-ipaddr.png)
[]!(screenshots/persistentvolume.png)
[]!(screenshots/yolocluster-azure.png)
[]!(screenshots/yolo external-deployment.png)
[]!(screenshots/yolo-ipaddr.png)
[]!(screenshots/yolo-local-deployment.png)



