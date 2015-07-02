package check

import (
	"net/http"
	"net/http/httptest"
	"testing"

	. "github.com/jzila/cureal/Godeps/_workspace/src/gopkg.in/check.v1"
	. "github.com/jzila/cureal/server"
)

// Hook up gocheck into the "go test" runner.
func Test(t *testing.T) { TestingT(t) }

type HandlerSuite struct {
	*Server
}

var _ = Suite(&HandlerSuite{
	Server: NewServer("localhost", 8081),
})

func (s *HandlerSuite) ServeAndRecord(req *http.Request) *httptest.ResponseRecorder {
	resp := httptest.NewRecorder()
	s.Handler.ServeHTTP(resp, req)
	return resp
}

func (s *HandlerSuite) TestGetHandler(c *C) {
	req, err := http.NewRequest("GET", "http://localhost:8081/hello", nil)
	c.Assert(err, IsNil)

	resp := s.ServeAndRecord(req)
	c.Assert(resp.Code, Equals, 200)

	req, err = http.NewRequest("POST", "http://localhost:8081/hello", nil)
	c.Assert(err, IsNil)
	resp = s.ServeAndRecord(req)
	c.Assert(resp.Code, Equals, 405)
}

func (s *HandlerSuite) TestHelloHandler(c *C) {
	req, err := http.NewRequest("GET", "http://localhost:8081/hello", nil)
	c.Assert(err, IsNil)

	resp := s.ServeAndRecord(req)
	c.Assert(resp.Code, Equals, 200)
	c.Assert(resp.Body.String(), Equals, "Hello from Gonc on port 8081 from container localhost\n")

}
