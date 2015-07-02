package server

import (
	"net/http"

	"github.com/jzila/cureal/server/handlers"
)

func getRoutes(env map[string]string) map[string]http.Handler {
	routes := map[string]http.Handler{
		"/hello": handlers.NewHelloHandler(env["server.host"], env["server.port"]),
		"/":      handlers.NewStaticHandler("static", "/"),
	}

	return routes
}

func MakeRouter(env map[string]string) *http.ServeMux {
	router := http.NewServeMux()

	for r, h := range getRoutes(env) {
		router.Handle(r, h)
	}

	return router
}
