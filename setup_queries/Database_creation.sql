drop table Genre;
drop table Book_order;
drop table phone_numbers;
drop table Book_author;
drop table Orders;
drop table Book;


drop table Publisher;
drop table Author;
drop table Users;


create table Author
	(author_id		varchar(10),
	 name		varchar(25),
	 email		varchar(25),
	 primary key (author_id)
	);
	
create table Publisher
	(publisher_id		varchar(10),
	 name		varchar(50),
	 address		varchar(50),
	 email_address		varchar(25),
	 banking_account	varchar (25),
	 primary key (publisher_id)
	);
	
create table Users
	(user_id		varchar(50),
	 email_address		varchar(25),
	 phone_number	varchar (11),
	 password	varchar(50),
	 primary key (user_id)
	);

create table Orders
	(order_id		varchar(10),
	 user_id		varchar(10),
	 destination	varchar (50),
	 current_location	varchar(50),
	 date_of_order	date,
	 primary key (order_id),
	 foreign key (user_id) references Users
	 	on delete set null
	);

create table Book
	(ISBN		varchar(13),
	 name		varchar(50),
	 publisher_id	varchar (10),
	 number_pages	numeric(4,0),
	 price	numeric(5,2),
	 publisher_cut	numeric(3,3),
	 cost	numeric(5,2),
	 stock	numeric(5,0),
	 primary key (ISBN),
	 foreign key (publisher_id) references publisher
	 	on delete cascade
	);

create table Book_order
	(order_id	varchar(10),
	ISBN	varchar(13),
	primary key (order_id, ISBN),
	foreign key (order_id) references Orders
	 	on delete cascade,
	foreign key (ISBN) references Book
	 	on delete cascade
	);
	
create table phone_numbers
	(publisher_id	varchar(10),
	phone_number	varchar(11),
	primary key (publisher_id, phone_number),
	foreign key (publisher_id) references Publisher
	 	on delete cascade
	);

create table Book_author
	(ISBN	varchar(13),
	author_id	varchar(10),
	primary key (ISBN, author_id),
	foreign key (ISBN) references Book
	 	on delete cascade,
	foreign key (author_id) references Author
	 	on delete cascade
	);

create table Genre
	(ISBN	varchar(13),
	name	varchar(15),
	primary key (ISBN, name),
	foreign key (ISBN) references Book
	 	on delete cascade
	);
	