package handlers

import (
	"net/http"
)

type SpecificHandler interface {
	ServeHTTPSpecific(w http.ResponseWriter, req *http.Request)
}
