/* dev will be deployed in ecr registry and ran in same jenkins server

staging will be deployed in s3



*/

pipeline {
    agent any 

    environment {
        IMAGE_NAME = "village-app"
        AWS_REGION = "ap-south-1"
        CONTAINER_NAME = "village-app"
        ECR_REPO = "905418203037.dkr.ecr.ap-south-1.amazonaws.com/frontend/village-app"
    }

    stages {
        stage('CHECKOUT') {
            steps {
                checkout scm
                echo "The code is checked out from ${env.BRANCH_NAME}"
            }
        }

        stage('BUILD/DEPLOY') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'aws-jenkins-cred',
                    usernameVariable: 'AWS_ACCESS_KEY_ID', 
                    passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                )]) { 
                    script {
                        if (env.BRANCH_NAME == 'development') {
                            echo "Building and deploying Docker image for development"

                            sh """
                                aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO
                                docker build -t $IMAGE_NAME:${env.BRANCH_NAME}-${BUILD_NUMBER} .
                                docker tag $IMAGE_NAME:${env.BRANCH_NAME}-${BUILD_NUMBER} $ECR_REPO:${env.BRANCH_NAME}-${BUILD_NUMBER}
                                docker push $ECR_REPO:${env.BRANCH_NAME}-${BUILD_NUMBER}
                            """
                        } else if (env.BRANCH_NAME == 'staging') {
                            echo "Syncing to S3 for staging"
                            sh """
                                aws s3 sync . s3://jenkins-static123/ --region $AWS_REGION --delete --exclude ".git/*" --exclude "Jenkinsfile"
                            """
                        } else if (env.BRANCH_NAME == 'master') {
                            echo "Master branch — no deployment configured"
                        } else {
                            echo "Branch ${env.BRANCH_NAME} is not configured for deployment"
                        }
                    }
                }
            }
        }

        stage('Stop Previous Containers') {
            when {
                expression { env.BRANCH_NAME == 'development' }
            }
            steps {
                sh '''
                    if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
                        echo "Stopping the running container"
                        docker stop $CONTAINER_NAME
                        docker rm $CONTAINER_NAME
                    elif [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
                        echo "Removing non-running container"
                        docker rm $CONTAINER_NAME
                    else
                        echo "No existing container found."
                    fi
                '''
            }
        }

        stage('RUN CONTAINER') {
            when {
                expression { env.BRANCH_NAME == 'development' }
            }
            steps {
                sh """
                    docker run -d -p 8181:80 --restart unless-stopped --name $CONTAINER_NAME $ECR_REPO:${env.BRANCH_NAME}-${BUILD_NUMBER}
                """
            }
        }
    }

    post {
        success {
            echo "Deployment was successful for ${env.BRANCH_NAME}"
        }
        failure {
            echo "Deployment failed for ${env.BRANCH_NAME}"
        }
    }
}