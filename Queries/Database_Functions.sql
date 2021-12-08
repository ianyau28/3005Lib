CREATE OR REPLACE FUNCTION restock()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
	IF NEW.stock < 10 THEN
		 UPDATE Book set stock = stock + 91 where stock < 10;
	END IF;

	RETURN NEW;
END; 
$$