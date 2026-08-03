pipeline {
    agent any

    environment {
        SPRING_DATASOURCE_URL = 'jdbc:postgresql://moneymanager-db.cfgq82gue3k6.eu-north-1.rds.amazonaws.com:5432/postgres'
        SPRING_DATASOURCE_USERNAME = 'postgres'
        SPRING_DATASOURCE_PASSWORD = credentials('spring-db-password')
        BREVO_USERNAME = 'a2fb7a001@smtp-brevo.com'
        BREVO_PASSWORD = credentials('brevo-smtp-password')
        BREVO_FROM_EMAIL = 'prajapatisujal1234@gmail.com'
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out latest code from GitHub main branch...'
                git branch: 'main', url: 'https://github.com/SujalPrajapati2006/moneymanager.git'
            }
        }

        stage('Build Spring Boot JAR') {
            steps {
                echo 'Compiling Java application with Maven...'
                dir('money-manager') {
                    sh 'chmod +x mvnw'
                    sh './mvnw clean package -DskipTests'
                }
            }
        }

        stage('Deploy Docker Container') {
            steps {
                echo 'Building Docker container and deploying to EC2...'
                dir('money-manager') {
                    sh 'docker rm -f backend || true'
                    sh 'docker system prune -f || true'
                    sh 'docker build --no-cache -t money-manager-backend .'
                    sh """
                    docker run -d \\
                      --name backend \\
                      -p 8080:8080 \\
                      -e SPRING_DATASOURCE_URL="${env.SPRING_DATASOURCE_URL}" \\
                      -e SPRING_DATASOURCE_USERNAME="${env.SPRING_DATASOURCE_USERNAME}" \\
                      -e SPRING_DATASOURCE_PASSWORD="${env.SPRING_DATASOURCE_PASSWORD}" \\
                      -e SPRING_JPA_HIBERNATE_DDL_AUTO="update" \\
                      -e BREVO_USERNAME="${env.BREVO_USERNAME}" \\
                      -e BREVO_PASSWORD="${env.BREVO_PASSWORD}" \\
                      -e BREVO_FROM_EMAIL="${env.BREVO_FROM_EMAIL}" \\
                      -e MONEY_MANAGER_FRONTEND_URL="*" \\
                      money-manager-backend
                    """
                }
            }
        }
    }

    post {
        success {
            echo '🎉 Backend deployment via Jenkins Pipeline completed successfully!'
        }
        failure {
            echo '❌ Jenkins Pipeline build failed. Please check build logs.'
        }
    }
}
