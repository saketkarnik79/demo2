pipeline {
    agent any 
    
    stages {
        stage ('checkout') {
            steps {
                checkout scm
            }

        }

        stage ('deploy to s3') {
            steps {
                sh ''' 
                   aws s3 sync . s3://jenkins-static123/ --region ap-south-1 --delete  --exclude ".git/*" --exclude "Jenkinsfile"
                '''
            }
        }
    }

    post {
        success {
            echo 'Deployment is successfull'
        }
    
        failure {
            echo 'Deployment is failed'
         }

    }
}

