/* dev will be deployed in ecr registry and ran in same jenkins server

staging will be deployed in s3



*/


pipeline {
    agent any 

    environment {

        IMAGE_NAME =  "village-app"
        AWS_REGION = "ap-south-1"
        CONTAINER_NAME = "village-app"
        ECR_REPO = "905418203037.dkr.ecr.ap-south-1.amazonaws.com/frontend/village-app"

    }

    stages {
        stage('CHECKOUT') {
            steps {
                checkout scm
                echo "the code is checked out from ${env.BRANCH_NAME}"
            }

        }

        stage('BUILD-DOCKER-IMAGE') {
            steps{
                withCredentials([usernamePassword(
                    credentialsID: 'aws-jenkins-cred',
                    usernameVariable: 'AWS_ACCESS_KEY_ID', 
                    passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                )]) { 
                    script{
                        if  {env.$BRANCH_NAME == 'development'} {
                            sh """
                            aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO
                            docker build -t village-app:${env.BRANCH_NMAE}-${BUILD_NUMBER} .
                            docker tag village-app:${env.BRANCH_NMAE}-${BUILD_NUMBER} $ECR_REPO:${env.BRANCH_NMAE}-${BUILD_NUMBER}
                            docker push $ECR_REPO:${env.BRANCH_NMAE}-${BUILD_NUMBER}
                            ./deploy-dev.sh
                            """
                            }
                        }else if (env.$BRANCH_NAME == 'staging') {
                            sh """
                            aws s3 sync . s3://jenkins-static123/ --region ap-south-1 --delete  --exclude ".git/*" --exclude "Jenkinsfile"
                            echo "deployed to s3"
                            """
                        } else {
                            echo "${env.BRANCH_NAME is not configured for deployment}"
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

        stage('DEPLOY TO ENVIRONMENT') {
            steps {
                sh """
                docker run -d -p 8181:80 --restart unless-stopped --name ${CONTAINER_NAME} $ECR_REPO:${env.BRANCH_NMAE}-${BUILD_NUMBER}
                """
            }

        }
    post {
        success {
            echo "deployment is successful"
        }
        failure {
            echo "deployment is failed"
        }
    }

    

    }

}

}