LOAD CSV WITH HEADERS FROM 'file:///Contracts.csv' AS line
CREATE (contractor:Contractor {
contractorId: line.ContractorId,
contractorName:line.Contractor,
contractorNumber:line.ContractNumber,
date:line.EffectiveDate}) return contractor;




LOAD CSV WITH HEADERS FROM 'file:///Images.csv' AS line
MERGE(image:Image {
imageId: line.`Image Id`,
defaultImage:line.defaultImage,
imageURL:line.`Image Url`}) 
return image;



LOAD CSV WITH HEADERS FROM 'file:///Products.csv' AS line
CREATE (product:Product {
productId:line.`Product Id`,
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
MATCH(p:Product {productId:line.`Product Id`}),(c:Contractor {contractorId:line.`Contractor Id`})
CREATE(p)-[:fromContractor]->(c) return c,p;



LOAD CSV WITH HEADERS FROM 'file:///product-images.csv' AS line
MATCH(p:Product {productId:line.`Product Id`}),(i:Image {imageId:line.`Image Id`})
CREATE(p)-[r:hasImage]->(i) return i,p,r;


MATCH(p:Product)-[:hasImage]->(i:Image) set p.images=Id(i),i.imageId=ID(i) return p,i;
















