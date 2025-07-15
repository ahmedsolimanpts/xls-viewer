#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
PROJECT_DIR="/home/ahmed/Downloads/xlsx-viewer"
IMAGE_NAME="xlsx-viewer-app"
HOST_PORT="8080" # Port on your host machine
CONTAINER_PORT="80" # Port inside the Docker container (Nginx default)
# --- End Configuration ---

echo "--- Starting Docker Deployment Script ---"

# 1. Navigate to the project directory
echo "Navigating to project directory: $PROJECT_DIR"
cd "$PROJECT_DIR"

# 2. Clean up previous build artifacts (optional, but ensures a fresh build)
echo "Cleaning up previous build directory..."
rm -rf build

# 3. Build the React application for production
echo "Building React application for production (npm run build)..."
npm run build

# 4. Stop and remove any existing container with the same name
echo "Stopping and removing any existing Docker container named '$IMAGE_NAME'...
"docker stop "$IMAGE_NAME" || true
docker rm "$IMAGE_NAME" || true

# 5. Remove any old Docker image with the same name (optional, ensures fresh image)
echo "Removing old Docker image '$IMAGE_NAME'...
"docker rmi "$IMAGE_NAME" || true

# 6. Build the new Docker image
echo "Building new Docker image '$IMAGE_NAME'...
"docker build -t "$IMAGE_NAME" .

# 7. Run the new Docker container in detached mode
echo "Running new Docker container '$IMAGE_NAME' on port $HOST_PORT...
"docker run -d -p "$HOST_PORT":"$CONTAINER_PORT" --name "$IMAGE_NAME" "$IMAGE_NAME"

echo "--- Deployment Complete! ---"
echo "Your application should now be accessible at http://localhost:$HOST_PORT"
echo "If you don't see the latest changes, please try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R) or clear your browser's cache."
echo "To stop the container: docker stop $IMAGE_NAME"
echo "To remove the container: docker rm $IMAGE_NAME"
echo "To remove the image: docker rmi $IMAGE_NAME"

git add .

git commit -m "Automated Deploy"

git push origin main
