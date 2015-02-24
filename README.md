# levelgraph-test
Simple test with levelgraph db

## Methods

### POST /
Add new graph to DB

Required data:
```
{
	subject: String,
	predicate: String,
	object: String
}
```

Return:
```
{
	desc: 'Success'
}
```

### GET /
Get list of graphs

Possible querystring:
```
	subject: String
	predicate: String
	object: String

	Ex: http://localhost:3000/?subject=John&predicate=like or http://localhost:3000/?predicate=like
```

Return:
```
{
	desc: [
		{
			subject: String,
			predicate: String,
			object: String
		}
	]
}

```

### GET /search/:subject/:predicate
Get list of graphs in a 2nd level (friends-of-friends like)

Return:
```
{
	desc: {
		friends: {
			'Subject name 1': {
				'friends-of-friends': ['Object1', 'Object2']
			},
			'Subject name 2': {
				'friends-of-friends': ['Object1', 'Object2']
			},
		}
	}
}
```
