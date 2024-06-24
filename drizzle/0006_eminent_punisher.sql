CREATE virtual TABLE `label_search`
USING fts5 (
	chain,
	value,
	content = 'labels',
	content_rowid = 'id'
);
