FROM python:3-bookworm AS builder

WORKDIR /db

COPY database .

RUN pip install -r requirements.txt

RUN python main.py

FROM scratch as output

COPY --from=builder /db/sv_db.db .
