CREATE TRIGGER book_stock_changes
	AFTER UPDATE
	ON Book
	FOR EACH ROW
	EXECUTE PROCEDURE restock();