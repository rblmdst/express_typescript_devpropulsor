import assert from "node:assert";
import { describe, it, mock } from "node:test";
import { employeeRepositoryFactory } from "./employee.repository";

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

describe("EmployeeRepository", () => {
  it("Should find the employees", async () => {
    // Arrange
    const find = mock.fn();
    const EmployeeModelStub: any = {
      find,
    };
    const employeeRepository = employeeRepositoryFactory(EmployeeModelStub);

    // Cas 1
    // Act
    await employeeRepository.getAll();
    // Assert
    assert.equal(find.mock.callCount(), 1);
    assert.deepEqual(find.mock.calls[0].arguments, []);

    // Cas 2
    // Act
    const department = "IT";
    await employeeRepository.getAll(department);
    // Assert
    assert.equal(find.mock.callCount(), 2);
    assert.deepEqual(find.mock.calls[1].arguments, [{ department }]);
  });

  it("Should find the employee by ID", async () => {
    // Arrange
    const findById = mock.fn((id) =>
      employees.find((employee) => employee._id === id)
    );
    const EmployeeModelStub: any = {
      findById,
    };
    const employeeRepository = employeeRepositoryFactory(EmployeeModelStub);

    // Cas 1
    // Act
    await employeeRepository.getById("11b7c55c613442857f706780");
    // Assert
    assert.equal(findById.mock.callCount(), 1);
    assert.deepEqual(findById.mock.calls[0].arguments, [
      "11b7c55c613442857f706780",
    ]);
    assert.deepEqual(findById.mock.calls[0].result, undefined);

    // Cas 2
    // Act
    await employeeRepository.getById("66b7c55c613442857f706780");
    // Assert
    assert.equal(findById.mock.callCount(), 2);
    assert.deepEqual(findById.mock.calls[1].arguments, [
      "66b7c55c613442857f706780",
    ]);
    assert.deepEqual(findById.mock.calls[1].result, employees[0]);
  });
});
