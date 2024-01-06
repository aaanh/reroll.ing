# DO NOT USE ALPINE IMAGES!

FROM golang:1.21.5-bookworm as builder

WORKDIR /go/src/github.com/aaanh/reroll.ing

COPY server .

RUN go get -d -v ./...

RUN go install -v ./...

RUN go build -o server .

FROM debian:bookworm-slim as production

WORKDIR /root/

RUN mkdir server
COPY --from=builder /go/src/github.com/aaanh/reroll.ing/server ./server

# If you're failing at this line, generate sv_db.db in database folder first by running
# `python3 main.py`
RUN mkdir database
COPY database/sv_db.db /root/database/sv_db.db

EXPOSE 8080

WORKDIR /root/server

CMD ["sh", "-c", "./server"]

# CMD ["./server"]