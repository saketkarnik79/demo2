pipeline {
    agent any

    parameters {
        string(
            name: 'TAG',
            defaultValue: 'origin/staging',
            description: 'For example, to select a staging branch write "origin/staging".\nTo select tag v2014.4.1 write "v2014.4.1".'
        )
        string(
            name: 'NODE_ENV',
            defaultValue: 'production',
            description: 'Node environment for the build.'
        )
        choice(
            name: 'DEPLOY_CONFIG_BRANCH',
            choices: ['preprod', 'master'],
            description: 'If empty, it will skip all the custom repo and build LMS the old way.'
        )
    }

    stages {
        stage ("checkout") {
        checkout scmGit(
        branches: [[name: "*/${params.BRANCH_NAME}"]],
        userRemoteConfigs: [[url: 'https://github.com/your-repo.git']]
        )
    }
        stage('Example') {
            steps {
                echo "TAG: ${params.TAG}"
                echo "NODE_ENV: ${params.NODE_ENV}"
                echo "DEPLOY_CONFIG_BRANCH: ${params.DEPLOY_CONFIG_BRANCH}"
            }
        }
    }
}
