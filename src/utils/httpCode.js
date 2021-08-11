const httpCode = {
	400: 'Request parameter error',
	401: 'No permission to this page, please log in first.',
	403: 'The server denied this access',
	404: 'The requested resource was not found',
	500: 'internal server error',
	501: 'The server does not support the method used in the request',
	502: 'Gateway error',
	504: 'Gateway timeout',
}
export default httpCode
