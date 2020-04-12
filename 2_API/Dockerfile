# Build the image using existing Python image from docker.hub. Identify the version of python with the tag: 3.8-slim-buster, which is a lightweight linux distribution
FROM python:3.8-slim-buster

# Set the working directory (used by CMD below)
WORKDIR /app

# Install additional python packages
RUN pip install flask Flask-SQLAlchemy PyMySQL pendulum

# A meta command used to document that any containers should expose port 5000 with the docker run command
EXPOSE 5000

# Containers will run python on the file: /app/webserver.py
ENTRYPOINT ["flask"]
CMD ["run", "--host=0.0.0.0"]
