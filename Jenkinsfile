pipeline {
    agent any
    environment {
        PATH = "/usr/local/bin:${env.PATH}"
        dockerImage=''
        registry='anoosha1221/recipebook-backend-postgres'
        registryCredential='docker_hub'
        dockerhub_username='anoosha1221'
        dockerhub_password='surya@1359'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'recipe-features', url: 'https://github.com/anoosha-sanugula/recipeBook-backend.git'
            }
        }
        stage('Install dependencies') {
            steps {
                sh 'npm install' 
            }
        }
        stage('Test') {
            steps {
                sh 'npm run test'
            }
        }
        stage('Build docker image'){
            steps{
                script{
                    dockerImage=docker.build registry
                }
            }
        }
        stage('Docker Push') {
            agent any
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker_hub', passwordVariable: 'surya@1359', usernameVariable: 'anoosha1221')]) {
                    sh 'docker login -u ${dockerhub_username} -p ${dockerhub_password}'
                    sh 'docker push ${registry}'
                }
            }
        }
    }
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed.'
        }
        always {
            mail bcc: '', body: """'project:${env.JOB_NAME} Build number: ${env.BUILD_NUMBER}  url:${env.BUILD_URL}'""", subject: """'${currentBuild.result}'""", to: 'anooshasanugula@gmail.com'
        }
    }
}