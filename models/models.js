function User(user) {
  this.login = user.login;
  this.password = user.password;
  this.surname = user.surname;
  this.name = user.name;
  this.patronymic = user.patronymic;
  this.birthDate = user.birthDate;
  this.telephone = user.telephone;
  this.key = "";
  this.job=new Job(user.job);
  this.document=new Document(user.document);

  this.returnJSON = () => {
    return {  
      login: this.login,
      password: this.password,
      surname: this.surname,
      name: this.name,
      patronymic: this.patronymic,
      birthDate: this.birthDate,
      telephone: this.telephone,
      job: this.job.returnJSON(),
      document: this.document.returnJSON()
    };
  };
}

function Document(document) {
  this.series = document.series;
  this.number = document.number;
  this.issueDate = document.issueDate;

  this.returnJSON = () => {
    return {  
      series: this.series,
      number: this.number,
      issueDate: this.issueDate,
    };
  };
}

function Job(job) {
  this.name = job.name;
  this.telephone = job.telephone;
  this.address = job.address;

  this.returnJSON = () => {
    return {  
      name: this.name,
      telephone: this.telephone,
      address: this.address,
    };
  };
}

export { User, Document, Job };
