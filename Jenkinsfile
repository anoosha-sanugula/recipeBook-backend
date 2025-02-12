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
        stage('Build Docker image'){
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
        stage('Pull Docker image'){
            steps{
                script {
                    echo 'Pulling Docker image from Docker Hub...'
                    sh 'docker pull ${registry}'
                }
            }
        }
        stage('Run Docker Container') {
            steps {
                script {
                    echo 'Running Docker container...'
                    sh 'docker run --name backend-container -d ${registry}'
                }
            }
        }
        stage('Verify Container Running') {
            steps {
                script {
                    echo 'Verifying if the Docker container is running...'
                    sh 'docker ps -a'
                }
            }
        }
        stage('Remove container'){
            steps {
                script {
                    echo 'Cleaning up Docker container...'
                    sh 'docker rm -f backend-container || true' 
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
            echo "Sending email notification..."
            mail bcc: '', body: """'project:${env.JOB_NAME} Build number: ${env.BUILD_NUMBER}  url:${env.BUILD_URL}'""", subject: """'${currentBuild.result}'""", to: 'anooshasanugula@gmail.com'
        }
    }
}