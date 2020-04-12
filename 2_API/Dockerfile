FROM python:3.8-slim-buster
WORKDIR /app
ENV FLASK_APP webserver.py
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
EXPOSE 5000
CMD python webserver.py
