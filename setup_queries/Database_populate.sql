delete from Book_order;
delete from phone_numbers;
delete from Orders;
delete from Book_author;
delete from Book;
delete from Publisher;
delete from Author;
delete from Users;

insert into Users values ('dummy1', 'dummy1@gmail.com', '12345678901', 'dummy1pass');
insert into Users values ('dummy2', 'dummy2@gmail.com', '12345678902', 'dummy2pass');
insert into Users values ('dummy3', 'dummy3@gmail.com', '12345678903', 'dummy3pass');
insert into Users values ('dummy4', 'dummy4@gmail.com', '12345678904', 'dummy4pass');

insert into Author values ('1', 'J. K. Rowling', 'info@jkrowling.com');
insert into Author values ('2', 'Suzanne Collins', 'info@suzannecollins.com');
insert into Author values ('3', 'Rick Riordan', 'info@rickriordan.com');
insert into Author values ('4', 'Cassandra Clare', 'info@cassandraclare.com');

insert into Publisher values ('1', 'Bloomsbury Publishing', '31 Bedford Avenue, London', 'bloomsbury@gmail.com', 'bloomsburybankaccount');
insert into Publisher values ('2', 'Scholastic Press', '557 Broadway New York, NY', 'scholastic@gmail.com', 'scholasticbankaccount');
insert into Publisher values ('3', 'Disney Books', '125 West End Avenue New York, NY', 'disneybooks@gmail.com', 'disneybooksbankaccount');
insert into Publisher values ('4', 'Margaret K. McElderry', '1230 Avenue of the Americas New York, NY', 'margaret@gmail.com', 'margaretbankaccount');

insert into Book values ('9780747532743', 'Harry Potter and the Phliosophers Stone', '1', '223', '15.00', '0.02', '10.00', '100');
insert into Book values ('9780195798760', 'Harry Potter and the Chamber of Secrets', '1', '251', '15.00', '0.02', '10.00', '100');
insert into Book values ('9780317456394', 'Harry Potter and the Prisoner of Azkaban', '1', '317', '20.00', '0.03', '15.00', '100');
insert into Book values ('9780195799163', 'Harry Potter and the Goblet of Fire', '1', '636', '25.00', '0.02', '20.00', '100');
insert into Book values ('9780320048500', 'Harry Potter and the Order of the Phoenix', '1', '766', '27.00', '0.02', '25.00', '100');
insert into Book values ('9780307283672', 'Harry Potter and the Half-Blood Prince', '1', '607', '27.00', '0.04', '25.00', '100');
insert into Book values ('9780545139700', 'Harry Potter and the Deathly Hallows', '1', '607', '30.00', '0.03', '25.00', '100');
insert into Book values ('9780439023528', 'The Hunger Games', '2', '374', '19.00', '0.02', '13.00', '100');
insert into Book values ('9780545227247', 'Catching Fire', '2', '391', '21.00', '0.01', '15.00', '100');
insert into Book values ('9780439023511', 'Mockingjay', '2', '390', '25.00', '0.01', '20.00', '100');
insert into Book values ('9780786838653', 'The Lightning Thief', '3', '377', '17.00', '0.01', '10.00', '100');
insert into Book values ('9780786290741', 'The Sea of Monsters', '3', '279', '20.00', '0.04', '12.00', '100');
insert into Book values ('9781423101451', 'The Titans Curse', '3', '312', '20.00', '0.01', '15.00', '100');
insert into Book values ('9781423101468', 'The Battle of the Labyrinth', '3', '361', '22.00', '0.02', '18.00', '100');
insert into Book values ('9781423101475', 'The Last Olympian', '3', '381', '25.00', '0.01', '20.00', '100');
insert into Book values ('9781423113393', 'The Lost Hero', '3', '557', '30.00', '0.03', '22.00', '100');
insert into Book values ('9781423140597', 'The Son of Neptune', '3', '513', '30.00', '0.03', '25.00', '100');
insert into Book values ('9781423140603', 'The Mark of Athena', '3', '586', '32.00', '0.01', '25.00', '100');
insert into Book values ('9781423146728', 'The House of Hades', '3', '597', '33.00', '0.03', '27.00', '100');
insert into Book values ('9781423146735', 'The Blood of Olympus', '3', '516', '35.00', '0.05', '27.00', '100');
insert into Book values ('9781484732748', 'The Hidden Oracle', '3', '384', '34.00', '0.03', '25.00', '100');
insert into Book values ('9781416955078', 'City of Bones', '4', '485', '15.00', '0.01', '12.00', '100');
insert into Book values ('9781416972242', 'City of Ashes', '4', '464', '16.00', '0.01', '12.00', '100');
insert into Book values ('9781481455985', 'City of Glass', '4', '496', '20.00', '0.02', '13.00', '100');
insert into Book values ('9781442403543', 'City of Fallen Angels', '4', '432', '21.00', '0.02', '17.00', '100');
insert into Book values ('9781481456005', 'City of Lost Souls', '4', '592', '22.00', '0.03', '18.00', '100');
insert into Book values ('9781481444422', 'City of Heavenly Fire', '4', '768', '25.00', '0.02', '20.00', '100');

insert into Book_author values ('9780747532743', '1');
insert into Book_author values ('9780195798760', '1');
insert into Book_author values ('9780317456394', '1');
insert into Book_author values ('9780195799163', '1');
insert into Book_author values ('9780320048500', '1');
insert into Book_author values ('9780307283672', '1');
insert into Book_author values ('9780545139700', '1');
insert into Book_author values ('9780439023528', '2');
insert into Book_author values ('9780545227247', '2');
insert into Book_author values ('9780439023511', '2');
insert into Book_author values ('9780786838653', '3');
insert into Book_author values ('9780786290741', '3');
insert into Book_author values ('9781423101451', '3');
insert into Book_author values ('9781423101468', '3');
insert into Book_author values ('9781423101475', '3');
insert into Book_author values ('9781423113393', '3');
insert into Book_author values ('9781423140597', '3');
insert into Book_author values ('9781423146728', '3');
insert into Book_author values ('9781423146735', '3');
insert into Book_author values ('9781484732748', '3');
insert into Book_author values ('9781416955078', '4');
insert into Book_author values ('9781416972242', '4');
insert into Book_author values ('9781481455985', '4');
insert into Book_author values ('9781442403543', '4');
insert into Book_author values ('9781481456005', '4');
insert into Book_author values ('9781481444422', '4');

insert into phone_numbers values ('1', '12328433399');
insert into phone_numbers values ('2', '12102942399');
insert into phone_numbers values ('2', '19284722239');
insert into phone_numbers values ('3', '63332947462');
insert into phone_numbers values ('3', '19284483029');
insert into phone_numbers values ('3', '67583384334');
insert into phone_numbers values ('4', '67483929348');
