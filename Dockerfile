FROM python:3.10-alpine

COPY ./src /app
COPY ./requirements.txt /app

WORKDIR /app

RUN pip install -r requirements.txt

CMD ["python", "./src/__init_.py"]