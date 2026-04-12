pipeline {
    agent any

    environment {
        DOCKER_USERNAME = 'menyar35160'
        IMAGE_BACKEND   = "${DOCKER_USERNAME}/pets-backend"
        IMAGE_FRONTEND  = "${DOCKER_USERNAME}/pets-frontend"
        VERSION         = "v${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Récupération du code...'
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                echo 'Build image backend...'
                sh "docker build -t ${IMAGE_BACKEND}:${VERSION} ./pets-Backend"
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Build image frontend...'
                sh "docker build -t ${IMAGE_FRONTEND}:${VERSION} ./pets-frontend"
            }
        }

        stage('Push Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                    sh "docker push ${IMAGE_BACKEND}:${VERSION}"
                    sh "docker push ${IMAGE_FRONTEND}:${VERSION}"
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Déploiement en cours...'
                sh "docker compose up -d"
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline réussie !'
        }
        failure {
            echo '❌ Pipeline échouée !'
        }
    }
}