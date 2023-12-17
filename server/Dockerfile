FROM golang:1.21.2-alpine as builder

WORKDIR /go/src/github.com/aaanh/reroll.ing

COPY . .

RUN go get -d -v ./...

RUN go install -v ./...

RUN go build -o server .

FROM alpine:latest as production

WORKDIR /root/

COPY --from=builder /go/src/github.com/aaanh/reroll.ing/server .

EXPOSE 8080

CMD ["./server"]