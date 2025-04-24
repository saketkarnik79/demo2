pipeline {
    agent any 
    
    stages {
        stage ('checkout') {
            steps {
                checkout scm
            }

        }

        stage ('build') {
            steps {
            // Minify CSS/JS (Optional, if you want to minify)
            sh 'npm install -g css-minify'  // or use a different tool, depending on your setup
            sh 'css-minify ./src/css/styles.css -o ./dist/css/styles.min.css'
            sh 'npm install -g uglify-js'  // Optional: minify JS
            sh 'uglifyjs ./src/js/app.js -o ./dist/js/app.min.js'
           }
        }

        stage ('deploy to s3') {
            steps {
                sh ''' 
                   aws s3 sync . s3://${jenkins-static123}/ --delete --acl public-read --exclude ".git/*" --exclude "Jenkinsfile"
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

