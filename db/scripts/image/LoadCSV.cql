MATCH(n:Order) detach delete n;
MATCH(n:OrderItem) detach delete n;
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
date:line.EffectiveDate});



LOAD CSV WITH HEADERS FROM 'file:///Images.csv' AS line
MERGE(image:Image {
imageId: toInt(line.`Image Id`),
defaultImage:line.defaultImage,
imageURL:line.`Image Url`});



LOAD CSV WITH HEADERS FROM 'file:///Products.csv' AS line
CREATE (product:Product {
productId:toInt(line.`Product Id`),
name: line.`Item Name`,
contractCategory:line.Category,
contractSubCategory:line.`Sub Category`,
amazonProductId:line.`Amazon Product ID`,
amazonNumOfStars:"0",
unitOfMeasure:line.`Unit of Measure`,
quantityInUnitOfMeasure:toInt(line.`Quantity in Unit of Measure (If Applicable)`),
msrp:toFloat(line.List_Price_MSRP),
unitPrice:toFloat(line.Contract_Unit_Price),
discount:toFloat(line.Contract_Discount),
manufacturer:line.`Manufacturer (OEM)`,
manufacturerPartNumber:line.`Manufacturer Part Number (OEM #)`,
skuNum:line.`SKU # / Item #`,
dateAdded:0,
category:line.`Front End Category`,
popular:true,
images:line.images,
defaultImageId:line.defaultImageId,
description:line.`Item Description`});



LOAD CSV WITH HEADERS FROM 'file:///products-contractor.csv' AS line
MATCH(p:Product {productId:toInt(line.`Product Id`)}),(c:Contractor {contractorId:toInt(line.`Contractor Id`)})
CREATE(p)-[:fromContractor]->(c);



LOAD CSV WITH HEADERS FROM 'file:///product-images.csv' AS line
MATCH(p:Product {productId:toInt(line.`Product Id`)}) with p,extract( x IN split(line.`Image Id`, "|") | toInt(trim(x)) ) AS vals
MATCH(i:Image) where i.imageId in vals with i,p
CREATE(p)-[r:hasImage]->(i);



LOAD CSV WITH HEADERS FROM 'file:///Orders.csv' AS line
MATCH (u:User) WHERE (u.userName) = "authuser"
WITH u, line
CREATE (o:Order {
    orderId:toInt(line.orderId),
    status:line.status,
    dateCreated:toInt(line.dateCreated)
})
CREATE (o)-[:placedBy]->(u);



LOAD CSV WITH HEADERS FROM 'file:///OrderItems.csv' AS line
MATCH (o:Order {orderId:toInt(line.orderId)})
MATCH (p:Product {productId:toInt(line.productId)})
WITH o,p,line
CREATE (o)-[:contains]->(
oi:OrderItem {
    quantity: toInt(line.quantity),
    status: line.status,
    subTotal: toInt(line.quantity) * toFloat(p.unitPrice)
})-[:orderedProduct]->(p);



MATCH(u:User) set u.userId=ID(u)
//return u;

MATCH(p:Product)-[:hasImage]->(i:Image) set p.productId=Id(p),i.imageId=ID(i)
//return p.productId, count(i) AS ImageCount;

MATCH(p:Product)-[:fromContractor]->(c:Contractor) set p.contractorId=Id(c), c.contractorId=ID(c)
//return p.productId, count(c) AS ContractorCount;

MATCH(o:Order)-[:contains]->(oi:OrderItem) set o.orderId=Id(o), oi.orderItemId=ID(oi)
//return o.orderId, count(oi) AS OrderItemsCount;





















