FROM python:3.7.2-slim

WORKDIR /usr/src/

COPY ./requirements.txt /usr/src/requirements.txt
RUN pip install -r requirements.txt

COPY . /usr/src/

EXPOSE 4433

ENV FLASK_APP=/usr/src/app/http/api/endpoints.py
ENV FLASK_ENV=development
# ENV MONGO_URL=mongodb://admin:admin@http://b65465aa.ngrok.io:27017

CMD python -m flask run --port=4433 --host 0.0.0.0