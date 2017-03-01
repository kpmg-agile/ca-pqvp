MATCH(n:User) detach delete n;
MATCH(n:Product) detach delete n;
MATCH(n:Contractor) detach delete n;
MATCH(n:Image) detach delete n;

Create (user:User {userName:"authuser",userId:"1",firstName:"authorized",lastName:"user",password:"passwd"});
Create (user:User {userName:"adminuser",userId:"2",firstName:"admin",lastName:"user",password:"passwd"});

LOAD CSV WITH HEADERS FROM 'file:///Contracts.csv' AS line
CREATE (contractor:Contractor {
contractorId: toInt(line.ContractorId),
contractorName:line.Contractor,
contractorNumber:line.ContractNumber,
date:line.EffectiveDate}) return contractor;




LOAD CSV WITH HEADERS FROM 'file:///Images.csv' AS line
MERGE(image:Image {
imageId: toInt(line.`Image Id`),
defaultImage:line.defaultImage,
imageURL:line.`Image Url`})
return image;



LOAD CSV WITH HEADERS FROM 'file:///Products.csv' AS line
CREATE (product:Product {
productId:toInt(line.`Product Id`),
name: line.`Item Name`,
contractCategory:line.Category,
contractSubCategory:line.`Sub Category`,
amazonProductId:line.`Amazon Product ID`,
amazonNumOfStars:"0",
unitOfMeasure:line.`Unit of Measure`,
quantityInUnitOfMeasure:line.`Quantity in Unit of Measure (If Applicable)`,
msrp:line.List_Price_MSRP,
unitPrice:line.Contract_Unit_Price,
discount:line.Contract_Discount,
manufacturer:line.`Manufacturer (OEM)`,
manufacturerPartNumber:line.`Manufacturer Part Number (OEM #)`,
skuNum:line.`SKU # / Item #`,
dateAdded:0,
category:line.`Front End Category`,
popular:true,
images:line.images,
defaultImageId:line.defaultImageId,
description:line.`Item Description`}) return product;



LOAD CSV WITH HEADERS FROM 'file:///products-contractor.csv' AS line
MATCH(p:Product {productId:toInt(line.`Product Id`)}),(c:Contractor {contractorId:toInt(line.`Contractor Id`)})
CREATE(p)-[:fromContractor]->(c) return c,p;



LOAD CSV WITH HEADERS FROM 'file:///product-images.csv' AS line
MATCH(p:Product {productId:toInt(line.`Product Id`)}) with p,extract( x IN split(line.`Image Id`, "|") | toInt(trim(x)) ) AS vals
MATCH(i:Image) where i.imageId in vals with i,p
CREATE(p)-[r:hasImage]->(i) return i,p,r;


MATCH(p:Product)-[:hasImage]->(i:Image) set p.productId=Id(p),i.imageId=ID(i) return p,i;

MATCH(p:Product)-[:fromContractor]->(c:Contractor) set p.contractorId=Id(c),c.contractorId=ID(c) return p,c;

Match(u:User) set u.userId=ID(u) return u;

















