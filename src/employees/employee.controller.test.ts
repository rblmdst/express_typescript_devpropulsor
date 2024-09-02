import assert from "node:assert";
import { describe, it, mock } from "node:test";
import { employeeControllerFactory } from "./employee.controller";

const employees = [
  {
    _id: "66b7c55c613442857f706780",
    name: "User Tooto",
    department: "IT",
    level: "J",
    createdBy: "66b7c4d2613442857f70677a",
    __v: 0,
  },
];

describe("EmployeeController", () => {
  it("Should get all employees", async () => {
    // Arrange
    const getEmployees = mock.fn(() => employees);

    const employeeServiceStub: any = {
      getEmployees,
    };
    const employeeController = employeeControllerFactory(employeeServiceStub);

    const reqWithoutDepartment: any = {
      query: {
        department: undefined,
      },
    };
    const reqWithDepartment: any = {
      query: {
        department: "IT",
      },
    };

    const jsonSpy = mock.fn();
    const res: any = {
      json: jsonSpy,
    };
    // Case 1 : (without department)
    // Act
    await employeeController.getAllEmployees(reqWithoutDepartment, res);
    // Assert
    assert.equal(getEmployees.mock.callCount(), 1);
    assert.deepEqual(getEmployees.mock.calls[0].arguments, [undefined]);

    assert.equal(jsonSpy.mock.callCount(), 1);
    assert.deepEqual(jsonSpy.mock.calls[0].arguments, [employees]);

    // Case 2 : (with department)
    // Act
    await employeeController.getAllEmployees(reqWithDepartment, res);
    // Assert
    assert.equal(getEmployees.mock.callCount(), 2);
    assert.deepEqual(getEmployees.mock.calls[1].arguments, ["IT"]);

    assert.equal(jsonSpy.mock.callCount(), 2);
    assert.deepEqual(jsonSpy.mock.calls[1].arguments, [employees]);
  });

  it("Should get employee by ID", async () => {
    // Arrange
    const getEmployee = mock.fn((id) =>
      employees.find((employee) => employee._id === id)
    );

    const employeeServiceStub: any = {
      getEmployee,
    };
    const employeeController = employeeControllerFactory(employeeServiceStub);

    const req1: any = {
      params: {
        employeeId: "66b7c55c613442857f706799",
      },
    };

    const req2: any = {
      params: {
        employeeId: "66b7c55c613442857f706780",
      },
    };

    const statusSpy = mock.fn();
    const endSpy = mock.fn();
    const jsonSpy = mock.fn();

    const res: any = {
      status: statusSpy,
      end: endSpy,
      json: jsonSpy,
    };

    // Act
    await employeeController.getEmployeeById(req1, res);

    // Assert
    assert.equal(statusSpy.mock.callCount(), 1);
    assert.deepEqual(statusSpy.mock.calls[0].arguments, [404]);
    assert.equal(endSpy.mock.callCount(), 1);

    // Act
    await employeeController.getEmployeeById(req2, res);

    // Assert
    assert.equal(jsonSpy.mock.callCount(), 1);
    assert.deepEqual(jsonSpy.mock.calls[0].arguments, [employees[0]]);
  });
});
