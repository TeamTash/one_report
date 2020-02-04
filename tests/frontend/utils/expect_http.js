import mockAxios from 'jest-mock-axios';
import {PermissionsError} from "~/services/auth";

class Request {
  constructor(request) {
    this.request = request;
    this._url = '';
    this._method = '';
    this._query = undefined;
    this._body = undefined;
    this._headers = {
      "Authorization": 'Bearer null'
    };
  }
  toReturn(data) {
    mockAxios.mockResponse({
      data,
    });
    expect(this.request).resolves.toBe(data);
    this.toInvoke()
  }
  toPermissionFail() {
    mockAxios.mockError({
      response: {
        status: 401,
        data: {
          details: "permission denied!"
        }
      },
    });
    expect(this.request).rejects.toThrow(PermissionsError);
    this.toInvoke()
  }
  toInvoke() {
    expect(mockAxios.request).toBeCalledWith(
      {
        'method': this._method,
        'url': this._url,
        'params': this._query,
        'data': this._body,
        'headers': this._headers
      }
    )
  }
  withQuery(query) {
    this._query = query;
    return this;
  }
  withHeader(headers) {
    this._headers = headers;
    return this;
  }
  withBody(body) {
    this._body = body;
    return this;
  }
  requestMethod(method) {
    return (url) => {
      this._method = method;
      this._url = url;
      return this;
    }
  }
  get = this.requestMethod('get');
  post = this.requestMethod('post');
  put = this.requestMethod('put');
  delete = this.requestMethod('delete');
  head = this.requestMethod('head');
  trace = this.requestMethod('trace');
  patch = this.requestMethod('patch');
  connect = this.requestMethod('connect');
}

export const expectHTTP = (request) => {
  return new Request(request);
};

export default expectHTTP;
