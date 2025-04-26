pipeline {
    agent any 

    environment {
        IMAGE_NAME = "village-app"
        CONTAINER_NAME = "village-app"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Stop Previous Container') {
            steps {
                script {
                    sh """
                    echo "Checking for existing container..."
                    if [ \$(docker ps -q -f name=${CONTAINER_NAME}) ]; then 
                        echo "Stopping and removing running container..."
                        docker stop ${CONTAINER_NAME}
                        docker rm ${CONTAINER_NAME}
                    elif [ \$(docker ps -aq -f name=${CONTAINER_NAME}) ]; then
                        echo "Container exists but not running — removing it..."
                        docker rm ${CONTAINER_NAME}
                    else 
                        echo "No existing container found."
                    fi
                    """
                }
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    docker.build("${IMAGE_NAME}:${BUILD_NUMBER}")
                }
            }
        }

        stage('Run New Container') {
            steps {
                script {
                    sh """
                    docker run -d -p 8181:80 --restart unless-stopped --name ${CONTAINER_NAME} ${IMAGE_NAME}:${BUILD_NUMBER}
                    """
                }
            }
        }
    }
}
