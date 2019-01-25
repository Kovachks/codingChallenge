USE codingChallenge;

CREATE TABLE parentNode (
	id INT NOT NULL AUTO_INCREMENT,
   parentName VARCHAR(30) NOT NULL,
    childNum INT (2) NOT NULL,
	upperBound INT (3) NOT NULL,
	lowerBound INT(3) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE root (
	id INT NOT NULL AUTO_INCREMENT,
    factoryName VARCHAR(30) NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE childNode (
	id INT NOT NULL AUTO_INCREMENT,
	parentID INT(3) NOT NULL,
    assignNum INT(3) NOT NULL,
    PRIMARY KEY (id)
);