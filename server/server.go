package server

import (
	"fmt"
	"net/http"
	"strconv"
)

type Server struct {
	*http.Server
	host string
	port int
}

func NewServer(h string, p int) *Server {
	env := map[string]string{
		"server.host": h,
		"server.port": strconv.Itoa(p),
	}
	s := &Server{
		host: h,
		port: p,
		Server: &http.Server{
			Addr:    fmt.Sprintf(":%d", p),
			Handler: MakeRouter(env),
		},
	}

	return s
}

func (s *Server) Serve() error {
	fmt.Printf("server listening on port %d\n", s.port)

	return s.ListenAndServe()
}
