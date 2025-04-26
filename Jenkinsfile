pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        ECR_REPO = '905418203037.dkr.ecr.ap-south-1.amazonaws.com/frontend/village-app'
        CONTAINER_NAME = "village-app"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Build and Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'aws-jenkins-cred', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    sh '''
                        aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO

                        docker build -t village-app:${BUILD_NUMBER} .
                        docker tag village-app:${BUILD_NUMBER} $ECR_REPO:${BUILD_NUMBER}
                        docker push $ECR_REPO:${BUILD_NUMBER}
                    '''
                }
            }
        }

        stage('Stop Previous Containers') {
            steps {
                sh '''
                if [ $(docker ps -q -f name=$CONTAINER_NAME) ]; then
                    echo "Stopping the running container"
                    docker stop $CONTAINER_NAME
                    docker rm $CONTAINER_NAME
                elif [ $(docker ps -aq -f name=$CONTAINER_NAME) ]; then
                    echo "Checking non running containers"
                    docker rm $CONTAINER_NAME
                else
                    echo "No existing container found."
                fi
                '''
            }
        }

        stage('Deploy New Container') {
            steps {
                sh '''
                docker pull $ECR_REPO:$BUILD_NUMBER
                docker run -d -p 8181:80 --restart unless-stopped --name $CONTAINER_NAME $ECR_REPO:$BUILD_NUMBER
                '''
            }
        }
    }
}
