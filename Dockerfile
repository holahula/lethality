FROM python:3.7.2-slim

WORKDIR /usr/src/app

COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt

COPY . /usr/src/app
ENV FLASK_APP=$PWD/app/http/api/endpoints.py
ENV FLASK_ENV=development

CMD python -m flask run --port=4433