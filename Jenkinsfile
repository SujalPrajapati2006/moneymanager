pipeline {
    agent any

    environment {
        MAVEN_OPTS = '-Xmx256m -XX:MaxMetaspaceSize=128m'
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
                echo 'Compiling Java application with Maven (low memory mode)...'
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
                    sh '''
                    docker run -d \
                      --name backend \
                      -p 8080:8080 \
                      -e SPRING_DATASOURCE_URL="jdbc:postgresql://moneymanager-db.cfgq82gue3k6.eu-north-1.rds.amazonaws.com:5432/postgres" \
                      -e SPRING_DATASOURCE_USERNAME="postgres" \
                      -e SPRING_DATASOURCE_PASSWORD="MoneyManager123!" \
                      -e SPRING_JPA_HIBERNATE_DDL_AUTO="update" \
                      -e BREVO_USERNAME="a2fb7a001@smtp-brevo.com" \
                      -e BREVO_PASSWORD=$(echo "eHNtdHBzaWItODFjNGQ1NzZhNGRiMDI5NGM0Y2VmZTkxYjlhM2IwMmQyNmRmM2QzN2NhMDNmODg2NzJhNTFhMWNlOGJlMjlkYi1iNm54aXR3WlE0Q0x4NXNR" | base64 -d) \
                      -e BREVO_FROM_EMAIL="prajapatisujal1234@gmail.com" \
                      -e MONEY_MANAGER_FRONTEND_URL="*" \
                      money-manager-backend
                    '''
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
