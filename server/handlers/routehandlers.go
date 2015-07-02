package handlers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
)

func NewHelloHandler(host, port string) http.Handler {
	return NewGetHandler(NewStringHandler(fmt.Sprintf("Hello from Cureal on port %s from container %s\n", port, host)))
}

func NewStaticHandler(hostRelPath, servePath string) http.Handler {
	dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
	if err != nil {
		return http.NotFoundHandler()
	}
	absPath := fmt.Sprintf("%s/%s", dir, hostRelPath)
	fs := http.FileServer(http.Dir(absPath))
	return NewGetHandler(http.StripPrefix(servePath, fs))
}
