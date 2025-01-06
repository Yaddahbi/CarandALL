public void UpdateStatus_ApprovesHuurverzoek()
{
	// Arrange
	var dto = new UpdateHuurverzoekDto { HuurStatus = "Goedgekeurd" };
	var context = TestHelper.CreateMockContext();
	var controller = new HuurverzoekController(context);

	// Act
	var result = controller.UpdateHuurverzoekStatus(1, dto);

	// Assert
	Assert.IsType<OkObjectResult>(result);
}

public void UpdateStatus_RejectsHuurverzoek_WithoutReason_ThrowsError()
{
	// Arrange
	var dto = new UpdateHuurverzoekDto { HuurStatus = "Afgewezen" };
	var controller = new HuurverzoekController(mockedContext);

	// Act & Assert
	Assert.Throws<Exception>(() => controller.UpdateHuurverzoekStatus(1, dto));
}
