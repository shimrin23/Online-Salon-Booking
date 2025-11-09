provider "aws" {
  region = "ap-south-1"   
}

resource "aws_instance" "my_ec2" {
  ami           = "ami-0dee22c13ea7a9a67"  
  instance_type = "t3.micro"
  key_name      = "id_rsa"   
  tags = {
    Name = "MyEC2Instance"
  }
}

output "public_ip" {
  value = aws_instance.my_ec2.public_ip
}
