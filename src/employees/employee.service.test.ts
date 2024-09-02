import assert from "node:assert";
import { describe, it, mock } from "node:test";
import { employeeServiceFactory } from "./employee.service";

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

describe("EmployeeService", () => {
  it("Should get the list of employee", async () => {
    const getAll = mock.fn(() => employees);
    // Arrange
    const employeeRepositoryStub: any = {
      getAll,
    };
    const employeeService = employeeServiceFactory(employeeRepositoryStub);

    // Cas 1:
    // Act
    await employeeService.getEmployees();

    // Assert
    assert.equal(getAll.mock.callCount(), 1);
    assert.deepEqual(getAll.mock.calls[0].arguments, [undefined]);
    assert.deepEqual(getAll.mock.calls[0].result, employees);

    // Cas 2:
    // Act
    const department = "IT";
    await employeeService.getEmployees(department);

    // Assert
    assert.equal(getAll.mock.callCount(), 2);
    assert.deepEqual(getAll.mock.calls[1].arguments, [department]);
    assert.deepEqual(getAll.mock.calls[1].result, employees);
  });

  it("Should get the employee by ID", async () => {
    const getById = mock.fn((id) =>
      employees.find((employee) => employee._id === id)
    );
    // Arrange
    const employeeRepositoryStub: any = {
      getById,
    };
    const employeeService = employeeServiceFactory(employeeRepositoryStub);

    // Cas 1:
    // Act
    await employeeService.getEmployee("66b7c55c613442857f706777");

    // Assert
    assert.equal(getById.mock.callCount(), 1);
    assert.deepEqual(getById.mock.calls[0].arguments, [
      "66b7c55c613442857f706777",
    ]);
    assert.deepEqual(getById.mock.calls[0].result, undefined);

    // Cas 2:
    // Act
    const employeeId = "66b7c55c613442857f706780";
    await employeeService.getEmployee(employeeId);

    // Assert
    assert.equal(getById.mock.callCount(), 2);
    assert.deepEqual(getById.mock.calls[1].arguments, [employeeId]);
    assert.deepEqual(getById.mock.calls[1].result, employees[0]);
  });
});
