pipeline {
    agent any
    
    environment {
        AWS_REGION = 'ap-south-1' // or whatever your region
        ECR_REPO = '905418203037.dkr.ecr.ap-south-1.amazonaws.com/frontend/village-app'
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
                        # No need for aws configure now
                        # AWS CLI automatically picks credentials from ENV

                        aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO

                        docker build -t village-app:${BUILD_NUMBER} .
                        docker tag village-app:${BUILD_NUMBER} $ECR_REPO:${BUILD_NUMBER}
                        docker push $ECR_REPO:${BUILD_NUMBER}
                    '''
                }
            }
        }
    }
}



/*

The below is a different approach with aws configure set in cli

pipeline {
    agent any
    
    environment {
        AWS_REGION = 'ap-south-1' // Your region
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'aws-jenkins-creds', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    sh '''
                        aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
                        aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
                        aws configure set default.region $AWS_REGION

                        # Now Docker build and push to ECR
                        eval $(aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin <your_account_id>.dkr.ecr.$AWS_REGION.amazonaws.com)

                        docker build -t my-app .
                        docker tag my-app:latest <your_account_id>.dkr.ecr.$AWS_REGION.amazonaws.com/my-app:latest
                        docker push <your_account_id>.dkr.ecr.$AWS_REGION.amazonaws.com/my-app:latest
                    '''
                }
            }
        }
    }
}


*/