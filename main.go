package main

import (
	"log"
	"os"
	"strconv"

	"github.com/jzila/cureal/server"
)

func main() {
	var port int = 8080
	portEnv := os.Getenv("PORT")

	if portEnv != "" {
		p, err := strconv.Atoi(portEnv)
		if err == nil {
			port = p
		}
	}

	server := server.NewServer(os.Getenv("HOSTNAME"), port)
	log.Fatal(server.Serve())
}
