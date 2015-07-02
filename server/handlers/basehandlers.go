package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type MethodHandler struct {
	http.Handler
	methods map[string]bool
}

func NewMethodHandler(methods []string, handler http.Handler) http.Handler {
	m := make(map[string]bool)
	for _, v := range methods {
		m[v] = true
	}
	return &MethodHandler{
		Handler: handler,
		methods: m,
	}
}

func (h *MethodHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	if h.methods[req.Method] {
		h.Handler.ServeHTTP(w, req)
	} else {
		w.WriteHeader(405)
	}
}

func NewGetHandler(handler http.Handler) http.Handler {
	return NewMethodHandler([]string{"GET"}, handler)
}

func NewPostHandler(handler http.Handler) http.Handler {
	return NewMethodHandler([]string{"POST"}, handler)
}

type ErrorHandler struct {
	err       error
	httpError int
}

func NewErrorHandler(err error, code int) http.Handler {
	return &ErrorHandler{
		err:       err,
		httpError: code,
	}
}

func (h *ErrorHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	w.WriteHeader(h.httpError)
	fmt.Fprintf(w, h.err.Error())
}

type StringHandler struct {
	s string
}

func NewStringHandler(s string) http.Handler {
	return &StringHandler{
		s: s,
	}
}

func (s *StringHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	w.WriteHeader(200)
	fmt.Fprintf(w, s.s)
}

func NewJsonHandler(o interface{}) http.Handler {
	m, err := json.Marshal(o)
	if err != nil {
		return NewErrorHandler(fmt.Errorf("Unable to generate JSON"), 500)
	}
	return NewStringHandler(string(m))
}
